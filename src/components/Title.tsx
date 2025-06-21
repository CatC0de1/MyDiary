import { Link } from "react-router-dom"

function Title() {
  return (
    <div className="fixed left-[5%] top-[5%] flex flex-col gap-5">
      <h1 className="text-3xl font-bold">
        MyDiary
      </h1>
      <Link to="/" className="bg-zinc-600 p-1 rounded-lg w-20 text-center hover:bg-zinc-700 transition-colors">Kembali</Link>
    </div>

  );
}

export default Title;