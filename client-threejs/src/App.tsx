import "./App.css";

import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { Line2 } from "three/examples/jsm/lines/Line2";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Mesh } from "three/src/objects/Mesh";

import * as dat from "dat.gui";

// flatShading

const CameraController = () => {
	const { camera, gl } = useThree();
	useEffect(() => {
		const controls = new OrbitControls(camera, gl.domElement);

		controls.minDistance = 3;
		controls.maxDistance = 20;
		return () => {
			controls.dispose();
		};
	}, [camera, gl]);
	return null;
};

let gui;

function App() {
	useEffect(() => {
		gui = new dat.GUI();
		return () => gui.destroy();
	}, []);
	return (
		<Canvas color="black" key={Math.random()} camera={{ position: [0, 0, 10] }}>
			<CameraController />
			<directionalLight position={[0, 0, 1]} args={["white", 1]} />
			<PlaneShape />
		</Canvas>
	);
}

function PlaneShape() {
	const root = useRef<Mesh>();

	const [state, setState] = useState({
		plane: {
			width: 10,
		},
	});
	useEffect(() => {
		gui.add(state.plane, "width", 1, 500).onChange((val) => {
			setState({ ...state, plane: { width: val } });
		});
		return () => gui.remove(state.plane);
	}, []);

	useEffect(() => {
		const { array } = root.current!.geometry.attributes.position;

		for (let i = 0; i < array.length; i += 3) {
			const x = array[i];
			const y = array[i + 1];
			const z = array[i + 2];
			array[i + 2] = Math.random();
		}
	}, [state]);
	useFrame(() => {
		// root.current!.rotation.x += 0.05;
	});
	return (
		<mesh ref={root}>
			<planeGeometry attach="geometry" args={[5, state.plane.width, 10, 10]} />

			<meshPhongMaterial flatShading color="blue" side={THREE.DoubleSide} />
		</mesh>
	);
}

function Sphere() {
	const root = useRef<Mesh>();
	const circleRef = useRef<Mesh>();
	const circleRef2 = useRef<Mesh>();
	const circleRef3 = useRef<Mesh>();

	useFrame(() => {
		root.current!.rotation.z += -0.02;
	});

	useEffect(() => {
		circleRef.current!.rotation.y = Math.PI / 4;
		circleRef.current!.translateX(3.5);
		circleRef.current!.translateZ(-2);
		circleRef2.current!.translateX(-3.5);
		circleRef2.current!.translateZ(-2);
		circleRef.current!.rotation.x = -Math.PI / 4;
		circleRef2.current!.rotation.y = -Math.PI / 4;
		circleRef2.current!.rotation.x = -Math.PI / 4;
		circleRef3.current!.rotation.x = Math.PI / 1.67;
	}, []);
	return (
		<mesh ref={root}>
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[30, 64, 32, 0, Math.PI * 2, 0, Math.PI * 2]} />
				<meshStandardMaterial color="#61dafb" />
			</mesh>
			<mesh ref={circleRef} position={[0, 0, 0]}>
				<torusGeometry args={[150, 5, 600, 600, Math.PI * 2]} />
				<meshStandardMaterial color="#61dafb" wireframe={true} />
			</mesh>
			<mesh ref={circleRef2} position={[0, 0, 0]} rotate={[10, 4, 0]}>
				<torusGeometry args={[150, 5, 600, 600, Math.PI * 2]} />

				<meshBasicMaterial color="#61dafb" />
			</mesh>
			<mesh ref={circleRef3} position={[0, 0, 0]} rotate={[10, 4, 0]}>
				<torusGeometry args={[150, 5, 600, 600, Math.PI * 2]} />

				<meshBasicMaterial color="#61dafb" />
			</mesh>
		</mesh>
	);
}

export default App;
