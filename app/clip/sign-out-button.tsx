export default function SignOutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <button
        type="submit"
        style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12, letterSpacing: "0.02em" }}
        className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150 underline underline-offset-2 decoration-zinc-200 dark:decoration-zinc-800"
      >
        Sign out
      </button>
    </form>
  );
}
