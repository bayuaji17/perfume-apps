import DetailPerfume from "@/components/public-component/detail-perfume";

export default async function DetailsPages({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log(id);
  return (
    <>
      <DetailPerfume id={id} />
    </>
  );
}
