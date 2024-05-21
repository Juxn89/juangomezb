'use client'
import { getI18NLabels } from "@/helpers"
import './Projects.css'

export const Projects = () => {

	const { Commons } = getI18NLabels()

	return (
		<section className="ProjectsSection">
			<h2> { Commons.ProjectsSectionLabel } </h2>
			<div className="ProjectsSectionContainer"></div>
		</section>
	)
}