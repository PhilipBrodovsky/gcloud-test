import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import logo from "../images/logo.png";

console.log(styles);

const Home: NextPage = () => {
	return (
		<div className="">
			<div className={styles.appBar}>
				<Image src={logo} alt="" />
				<nav className={styles.nav}>
					<div className="link">products</div>
					<div className="link">pricing</div>
					<div className="link">pricing</div>
					<div className="link">pricing</div>
				</nav>
				<button className={styles.button}>Sign in</button>
			</div>
		</div>
	);
};

export const getStaticProps = () => {
	return {
		props: {
			buildTimestamp: Date.now(),
		},
	};
};

export default Home;
