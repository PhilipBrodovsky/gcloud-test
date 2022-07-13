import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <h1>header</h1>
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
