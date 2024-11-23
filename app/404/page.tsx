import Link from "next/link";

export default function Page404() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-error text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            {Number("404").toLocaleString("fa-IR")}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 md:text-4xl dark:text-white">
            مشکلی رخ داده است
          </p>
          <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
            متأسفم نتوانستیم صحفه مورد نظر شما را پیدا کنیم
          </p>
          <Link
            href="/"
            className="inline-flex text-white bg-tint-7 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            احساس میکنی گم شدی؟ به خونه برگرد
          </Link>
        </div>
      </div>
    </section>
  );
}
