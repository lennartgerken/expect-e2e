import Link from 'next/link'

export default function ButtonLink({
    href,
    title
}: {
    href: string
    title: string
}) {
    return (
        <Link
            href={href}
            className="inline-block border border-gray-300 text-gray-600 rounded p-1 hover:bg-gray-50"
        >
            {title}
        </Link>
    )
}
