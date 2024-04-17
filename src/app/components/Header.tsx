import Link from 'next/link';

export function Header() {
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<Link className="btn btn-ghost text-xl" href="/">
					Media converter
				</Link>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link href="/video">Video</Link>
					</li>
					<li>
						<Link href="/image">Image</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
