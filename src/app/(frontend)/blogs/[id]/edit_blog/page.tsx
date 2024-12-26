import EditBlog from "@/components/(frontend)/EditBlog";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) return null; // Or handle the case when id is not available

  return <EditBlog blogId={id}/>;
}
