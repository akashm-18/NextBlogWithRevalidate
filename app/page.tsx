import Posts from "./components/Posts"
import MyProfile from './components/MyProfile'


export const revalidate = 10;

export default function Home() {
  return (
    <div className="mx-auto">
      <MyProfile />
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 😊&nbsp;
        <span className="whitespace-nowrap">
          I'm <span className="font-bold">Akash</span>
        </span>
      </p>
      <Posts />
    </div>
  )
}
