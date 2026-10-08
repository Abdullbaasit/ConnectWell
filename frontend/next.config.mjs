const backend = process.env.BACKEND_URL || 'http://127.0.0.1:4000';
export default { async rewrites(){return [{source:'/api/:path*',destination:`${backend}/api/:path*`}];}};
