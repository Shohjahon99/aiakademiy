import { redirect } from "next/navigation"

export default async function VerifyShortPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  redirect(`/verify-certificate?code=${code}`)
}
