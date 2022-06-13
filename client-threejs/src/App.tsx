import "./App.css";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function App() {
	return (
		<Canvas>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<Box />
		</Canvas>
	);
}

function Box(props) {
	useFrame((state, delta) => {
		// console.log(state, delta);
	});
	const mesh = useRef();
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	// Subscribe this component to the render-loop, rotate the mesh every frame

  useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

export default App;
