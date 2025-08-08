import RequestForm from "@/app/component/RequestForm";

export default function Page() {
  return <RequestForm title="Enviar - api/show" method="GET" endpointPath="/api/show" fields={[]} />;
}
