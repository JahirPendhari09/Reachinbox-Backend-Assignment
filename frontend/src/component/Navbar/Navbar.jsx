import { Link } from "react-router-dom";
import styles from "./Navbar.module.css"; 

const Navbar = () => {
    

    return <div className={styles.mainNavbar}>
        <div className={styles.logo}>
            <img src="https://media.licdn.com/dms/image/D560BAQEmo1aZIhVtlQ/company-logo_200_200/0/1700158687336/reachinbox_ai_logo?e=2147483647&v=beta&t=2eGcwWsFtdBcUVJGGHkBxWHYFN86D-c5zfyr4s3DsNw"/>
            <p>REACHINBOX</p>
        </div>
        <div className={styles.categories}>
            <Link >Features</Link>
            <Link>Pricing</Link>
            <Link>FAQs</Link>
        </div>
        <div className={styles.userSection}>
            <Link to="http://localhost:8080/auth/google/">Log in</Link>
            <button>Get Started Now</button>
        </div>
    </div>
}

export { Navbar }