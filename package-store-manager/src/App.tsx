import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function useModel<T>(model: T) {
	const [state, setState] = useState({ ...model });

	type K = keyof T;

	const api = Object.entries(model).reduce<{ [key: K]: T[K] }>((acc, model) => {
		const [key, value] = model;
		acc["set" + capitalizeFirstLetter(key)] = function (value) {
			setState({ ...state, [key]: value });
		};
		return acc;
	}, {});

	return { ...state, ...api };
}

function App() {
	const user = useModel({ age: 34, name: "philip" });

	console.log("====================================");
	console.log(user);
	console.log("====================================");

	return (
		<div className="App">
			<h1>{user.name}</h1>
			<h1>{user.age}</h1>
			<button onClick={() => user.setAge(user.age + 1)}>growth</button>
		</div>
	);
}

export default App;
