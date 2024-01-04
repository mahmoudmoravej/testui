import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";

import {
  FindCycleQuery,
  UpdateCycleMutation,
  useFindCycleQuery,
  useUpdateCycleMutation,
} from "@app-types/graphql";
import { CycleForm, CycleFormData } from "~/components/CycleForm";
import { getPureObject } from "~/utils";

type CycleEditFormData =
  | (CycleFormData & { id?: number | null })
  | null
  | undefined;

export default function CycleEdit() {
  const { id } = useParams();
  if (id == null) throw new Error("id is null");

  const { data, loading, error } = useFindCycleQuery({
    variables: { id: id },
    fetchPolicy: "network-only",
  });

  const [cycle, setCycle] = useState<CycleEditFormData>(getEditData(data));
  const [updateMethod] = useUpdateCycleMutation();

  useEffect(() => {
    setCycle(getEditData(data));
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;
  if (!cycle || !data) return <p>No data</p>;

  var onSubmit = function () {
    const { id: _, ...input } = { ...cycle };
    updateMethod({
      variables: {
        input: {
          id: id,
          cycleInput: { ...input },
        },
      },
      onError: (error) => {
        alert(error.message);
      },

      onCompleted: (data) => {
        setCycle(getEditData(data.cycleUpdate));
        alert("Saved!");
      },
    });
  };

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Modifying cycle: {cycle.title}
      </Typography>
      <CycleForm
        id={id}
        data={cycle}
        updateData={setCycle}
        onSubmit={onSubmit}
      />
    </Card>
  );
}

function getEditData(
  data: FindCycleQuery | UpdateCycleMutation["cycleUpdate"] | null | undefined,
): CycleEditFormData | null {
  if (!data) {
    return null;
  }

  return getPureObject(data?.cycle);
}
