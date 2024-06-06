import Link from "next/link";

export default function NotFound() {
    return (
        <div className="text-center">
            <p className="mt-10">
                Sorry. The Post doesn't Exists
            </p>
            <Link href="/">⬅️Back to Home</Link>
        </div>
    )
}