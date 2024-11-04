import helmet from 'helmet';

export default helmet({
//   contentSecurityPolicy: false,  // ปิดการใช้งาน CSP หากมีปัญหากับการโหลด resource
    crossOriginResourcePolicy: {
        policy: "same-site"
    }
});