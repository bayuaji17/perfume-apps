import DetailPerfume from "@/components/public-component/detail-perfume";

export default async function DetailsPages({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <DetailPerfume id={id} />
    </>
  );
}
