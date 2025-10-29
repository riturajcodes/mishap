import ZonePage from "./ZonePage";

export default async function Page({ params }) {
    const resolvedParams = await params; // ensures it's unwrapped
    return <ZonePage id={resolvedParams.id} />;
}
