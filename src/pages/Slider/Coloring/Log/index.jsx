import { useEffect } from "react";
import RMTransferLog from "./RMTransferLog";

export default function Index() {
	useEffect(() => {
		document.title = "Coloring Log";
	}, []);
	return (
		<div className="container mx-auto">
			{/* <SFGTransferLog />
			<hr className="border-2 border-dashed border-secondary-content" /> */}
			<RMTransferLog />
		</div>
	);
}
