
const rolePermissions = {
  admin: ['view_profile','view_users', 'create_user', 'update_user', 'update_password','delete_user'],
  staff: ['view_profile', 'update_password'],
};


function authorizePermissions(...requiredPermissions){

    return (req,res,next) => {

        const userRole = req.user.role;
        const permissions = rolePermissions[userRole] || [];

        const hasPermission = requiredPermissions.every(p=>permissions.includes(p));
        if(!hasPermission){
            return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
        }

        next();

    }

}



export default authorizePermissions;
