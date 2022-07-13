import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

console.log(styles);

const Home: NextPage = () => {
	return (
		<div className="">
			<div className={styles.appBar}>
				<span>dasda</span>
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
