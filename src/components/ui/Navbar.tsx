'use client'

import { FC } from "react";
import { Languages } from "./Languages";

export const Navbar: FC = () => {
	return(
		<nav className="flex w-full py-2 text-center">
			<div className="flex-auto"></div>
			<div className="flex-auto"></div>
			<div className="flex-auto">
				<Languages />
			</div>
		</nav>
	)
}