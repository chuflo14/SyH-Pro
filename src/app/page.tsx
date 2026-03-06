import { redirect } from "next/navigation"

export default function Home() {
  // Since we have a middleware handling the '/' redirect to either
  // dashboard, portal, or login, this page acts mostly as a fallback.
  redirect('/login')
}
