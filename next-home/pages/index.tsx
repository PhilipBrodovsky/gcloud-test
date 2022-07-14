import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.css";

console.log(styles);

const Home: NextPage = () => {
    return (
        <div className="">
            <div className={styles.appBar}>
                <Image src={"/images/logo.png"} width={75} height={75} />
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
