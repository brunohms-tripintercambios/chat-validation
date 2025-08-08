import RequestForm from "@/app/component/RequestForm";

export default function Page() {
  return <RequestForm title="Enviar - api/delete" method="PUT" endpointPath="/api/delete" fields={["ids"]} />;
}
