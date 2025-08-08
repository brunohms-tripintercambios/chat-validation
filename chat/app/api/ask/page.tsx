import RequestForm from "@/app/component/RequestForm";

export default function Page() {
  return <RequestForm title="Enviar - api/ask" method="POST" endpointPath="/api/ask" />;
}
