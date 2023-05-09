import {
    MamoriService, io_https
    , io_utils
    , io_role
    , io_alertchannel
    , io_ipresource
    , io_remotedesktop
    , io_ssh
    , io_permission
    , io_user
    , io_ondemandpolicies
} from 'mamori-ent-js-sdk';

const mamoriUrl = process.env.MAMORI_SERVER || '';
const mamoriUser = process.env.MAMORI_USERNAME || '';
const mamoriPwd = process.env.MAMORI_PASSWORD || '';

const mamoriKCUrl = process.env.MAMORI_SERVER2 || '';
const mamoriKCUser = process.env.MAMORI_USERNAME2 || '';
const mamoriKCPwd = process.env.MAMORI_PASSWORD2 || '';

const INSECURE = new io_https.Agent({ rejectUnauthorized: false });

const outputFile = process.env.MAMORI_OUTPUT_DIRECTORY + "mamori-config.json";
let fs = require('fs');

const arrayDiff = function (not: boolean, source: any, target: any, callback: any) {
    return source.filter((p: any) => {
        if (not) {
            return !target.some((f: any) => {
                return callback(p, f);
            });
        }
        return target.some((f: any) => {
            return callback(p, f);
        });
    });
}

async function extractQueries() {
    let api = new MamoriService(mamoriUrl, INSECURE);
    let apiKC = new MamoriService(mamoriKCUrl, INSECURE);
    try {

        console.info("Connecting to %s ...", mamoriUrl);
        let login = await api.login(mamoriUser, mamoriPwd);
        console.info("Login successful for: ", login.fullname, ", session: ", login.session_id);

        console.info("Connecting to %s ...", mamoriKCUrl);
        let loginkc = await apiKC.login(mamoriKCUser, mamoriKCPwd);
        console.info("Login successful for: ", loginkc.fullname, ", session: ", loginkc.session_id);
    } catch (e) {
        console.log("**** %o", e);
    }

    /*
    //ALERTS
    try {
        //ALERTS
        let dataKJ = await io_utils.noThrow(io_alertchannel.AlertChannel.list(api));
        let dataKC = await io_utils.noThrow(io_alertchannel.AlertChannel.list(apiKC));
        //NEW 
        let compareFunc = (s: any, t: any) => {
            return s.name === t.name;
        };
        let newItems = arrayDiff(true, dataKJ, dataKC, compareFunc);
        for (let r of newItems) {
            let n = new io_alertchannel.AlertChannel("").fromJSON(r);
            console.log("CREATING ALERT : %o", n);
            let res = await io_utils.noThrow(n.create(apiKC));
            console.log("CREATED ALERT : %o", res);
        }

        //DELETED 
        let deletedItems = arrayDiff(true, dataKC, dataKJ, compareFunc);
        for (let r of deletedItems) {
            let n = new io_alertchannel.AlertChannel("").fromJSON(r);
            console.log("DELETING ALERT : %o", n);
            let res = await io_utils.noThrow(n.delete(apiKC));
            console.log("DELETED ALERT : %o", res);
        }

        //UPDATED 
        let updateditems = [];
        for (let s of dataKJ) {
            for (let x of dataKC) {
                if (s.name === x.name && (JSON.stringify(s.actions) != JSON.stringify(x.actions))) {
                    x.actions = s.actions;
                    updateditems.push(x);
                    break;
                }
            }
        }

        for (let r of updateditems) {
            let n = new io_alertchannel.AlertChannel("").fromJSON(r);
            console.log("UPDATING ALERT : %o", n);
            let res = await io_utils.noThrow(n.update(apiKC));
            console.log("UPDATING ALERT : %o", res);
        }


    } finally {
        console.log("ALERTS DONE");
    }

    //IP RESOURCES
    try {
        let dataKJ = (await io_utils.noThrow(io_ipresource.IpResource.list(api, 0, 1000))).data;
        let dataKC = (await io_utils.noThrow(io_ipresource.IpResource.list(apiKC, 0, 1000))).data;
        let compareFunc = (s: any, t: any) => {
            return s.name === t.name;
        };
        let newItems = arrayDiff(true, dataKJ, dataKC, compareFunc);
        for (let r of newItems) {
            let n = new io_ipresource.IpResource("").fromJSON(r);
            console.log("CREATING IPRESOURCE : %o", n);
            let res = await io_utils.noThrow(n.create(apiKC));
            console.log("CREATED IPRESOURCE : %o", res);
        }
        //DELETED 
        let deletedItems = arrayDiff(true, dataKC, dataKJ, compareFunc);
        for (let r of deletedItems) {
            let n = new io_ipresource.IpResource("").fromJSON(r);
            console.log("DELETING IPRESOURCE : %o", n);
            let res = await io_utils.noThrow(n.delete(apiKC));
            console.log("DELETED IPRESOURCE : %o", res);
        }
        //NEW 
        let updateditems = dataKJ.filter((item: any) => {
            return dataKC.some((f: any) => {
                return (f.name === item.name && f.name != 'mamoriserver' && (f.ports != item.ports || f.cidr != item.cidr));
            });
        });
        for (let r of updateditems) {
            let n = new io_ipresource.IpResource("").fromJSON(r);
            console.log("UPDATING IPRESOURCE : %o", n);
            let res = await io_utils.noThrow(n.update(apiKC, n));
            console.log("UPDATING IPRESOURCE : %o", res);
        }
    } finally {
        console.log("IPRESOURCE DONE");
    }

    //REMOTE DESKTOPS
    try {
        let dataKJ = (await io_utils.noThrow(io_remotedesktop.RemoteDesktopLogin.list(api, 0, 1000))).data;
        let dataKC = (await io_utils.noThrow(io_remotedesktop.RemoteDesktopLogin.list(apiKC, 0, 1000))).data;
        let compareFunc = (s: any, t: any) => {
            return s.name === t.name;
        };
        let newItems = arrayDiff(true, dataKJ, dataKC, compareFunc);
        for (let r of newItems) {
            let n = await io_utils.noThrow(io_remotedesktop.RemoteDesktopLogin.getByName(api, r.name));
            console.log("CREATING REMOTE DESKTOP : %o", n);
            let res = await io_utils.noThrow(n.create(apiKC));
            console.log("CREATED REMOTE DESKTOP : %o", res);
        }

        //DELETED 
        let deletedItems = arrayDiff(true, dataKC, dataKJ, compareFunc);
        for (let r of deletedItems) {
            let n = io_remotedesktop.RemoteDesktopLogin.build(r);
            console.log("DELETING REMOTE DESKTOP : %o", n);
            let res = await io_utils.noThrow(n.delete(apiKC));
            console.log("DELETED REMOTE DESKTOP : %o", res);
        }


        //UPDATED 
        let updateditems: any = [];
        for (let s of dataKJ) {
            for (let x of dataKC) {
                if (s.name === x.name) {
                    let kj = await io_utils.noThrow(io_remotedesktop.RemoteDesktopLogin.getByName(api, s.name));
                    let kc = await io_utils.noThrow(io_remotedesktop.RemoteDesktopLogin.getByName(apiKC, x.name));
                    kj.rdp.password = '___Mamori_protected_password___';
                    kc.rdp.password = '___Mamori_protected_password___';
                    if (kj._record_session != kc._record_session ||
                        JSON.stringify(kj.rdp) != JSON.stringify(kc.rdp)) {
                        kc.rdp = kj.rdp;
                        kc._record_session = kj._record_session;
                        updateditems.push(kc);
                    }
                    break;
                }
            }
        }
        for (let r of updateditems) {
            let n = io_remotedesktop.RemoteDesktopLogin.build(r);
            console.log("UPDATING REMOTE DESKTOP : %o", n);
            let res = await io_utils.noThrow(n.update(apiKC));
            console.log("UPDATING REMOTE DESKTOP : %o", res);
        }
    } finally {
        console.log("REMOTE DESKTOPS DONE");
    }

    //SSH
    try {

        let dataKJ = (await io_utils.noThrow(io_ssh.SshLogin.getAll(api)));
        let dataKC = (await io_utils.noThrow(io_ssh.SshLogin.getAll(apiKC)));
        let compareFunc = (s: any, t: any) => {
            return s.name === t.name;
        };
        let newItems = arrayDiff(true, dataKJ, dataKC, compareFunc);
        for (let r of newItems) {
            let n = io_ssh.SshLogin.build(r);
            console.log("CREATING SSH : %o", n);
            let res = await io_utils.noThrow(n.create(apiKC));
            console.log("CREATED SSH : %o", res);

        }

        //DELETED 
        let deletedItems = arrayDiff(true, dataKC, dataKJ, compareFunc);
        for (let r of deletedItems) {
            let n = io_ssh.SshLogin.build(r);
            console.log("DELETING SSH : %o", n);
            let res = await io_utils.noThrow(n.delete(apiKC));
            console.log("DELETED SSH : %o", res);
        }

        //UPDATED 
        let updateditems: any = [];
        for (let s of dataKJ) {
            for (let x of dataKC) {
                if (s.name === x.name) {
                    if ((s.uri != x.uri ||
                        s.private_key_name != x.private_key_name ||
                        s.password != x.password)) {
                        console.log("**** SSH : %o %o", s, x);
                        let updated = JSON.parse(JSON.stringify(s));
                        updated.id = x.id;
                        updateditems.push(updated);
                    }
                    break;
                }
            }
        }


        for (let r of updateditems) {
            let n = io_ssh.SshLogin.build(r);
            console.log("UPDATING SSH : %o", n);
            let res = await io_utils.noThrow(n.update(apiKC));
            console.log("UPDATING SSH : %o", res);
        }
    }
    finally {
        console.log("SSH DONE");
    }

    try {
        let rolesKJ = await io_utils.noThrow(io_role.Role.getAll(api));
        let rolesKC = await io_utils.noThrow(io_role.Role.getAll(apiKC));
        let compareFunc = (s: any, t: any) => {
            return s.roleid === t.roleid;
        };
        let newRoles = arrayDiff(true, rolesKJ, rolesKC, compareFunc);
        for (let r of newRoles) {
            let n = io_role.Role.build(r);
            console.log("CREATING ROLE : %o", n);
            let res = await io_utils.noThrow(n.create(apiKC));
            console.log("CREATED ROLE : %o", res);
        }

        //DROP EXTRA
        let deletedRoles = arrayDiff(true, rolesKC, rolesKJ, compareFunc);
        for (let r of deletedRoles) {
            let n = io_role.Role.build(r);
            console.log("DELETING ROLE : %o", n);
            let res = await io_utils.noThrow(n.delete(apiKC));
            console.log("DELETED ROLE : %o", res);
        }

        //Find Updated roles
        let updatedRoles = rolesKJ.filter((role: any) => {
            return rolesKC.some((f: any) => {
                return (f.roleid === role.roleid && (f.externalname != role.externalname || f.position != role.position));
            });
        });
        for (let r of updatedRoles) {
            let n = io_role.Role.build(r);
            console.log("UPDATING ROLE : %o", n);
            let res = await io_utils.noThrow(n.update(apiKC));
            console.log("UPDATED ROLE : %o", res);
        }

    } finally {
        console.log("ROLES DONE");
    }

    try {
        //test API
        let roleSQL = "select roleid,grantee,withadminoption " +
            " from SYS.SYSROLES a " +
            " where isdef = 'N' and roleid not in ('public') " +
            " and grant_provider is null and valid_from is null and valid_until is null and granted_by_request_id is null and revoked_by_request_id is null  " +
            " and exists (select 1 from SYS.SYSROLES b where b.isdef = 'Y' and a.grantee = b.roleid )" +
            " order by roleid,grantee"
        let roleGrantsKJ = await io_utils.noThrow(api.select(roleSQL));
        let roleGrantsKC = await io_utils.noThrow(apiKC.select(roleSQL));
        let compareFunc = (s: any, t: any) => {
            return s.roleid === t.roleid && s.grantee === t.grantee;
        };
        let newitems = arrayDiff(true, roleGrantsKJ, roleGrantsKC, compareFunc);
        //GET ALL THE ROLES
        for (let r of newitems) {
            let n = new io_permission.RolePermission().role(r.roleid).grantee(r.grantee).withGrantOption(r.withadminoption == 'Y');
            console.log("CREATING ROLE GRANT : %o", n);
            let res = await io_utils.noThrow(n.grant(apiKC));
            console.log("CREATED ROLE GRANT : %o", res);
        }
        //DEL GRANTS
        let delitems = arrayDiff(true, roleGrantsKC, roleGrantsKJ, compareFunc);
        for (let r of delitems) {
            let n = new io_permission.RolePermission().role(r.roleid).grantee(r.grantee);
            console.log("DELETING ROLE GRANT : %o", n);
            let res = await io_utils.noThrow(n.revoke(apiKC));
            console.log("DELETED ROLE GRANT : %o", res);
        }

    } finally {
        console.log("ROLES GRANTS DONE");
    }

    try {
        let rolesKJ = await io_utils.noThrow(io_role.Role.getAll(api));
        for (let role of rolesKJ) {
            console.log("PERMISSIONS FOR ROLE : %s", role.roleid);
            try {
                let rolePermissionsKJ = (await io_utils.noThrow(io_permission.Permissions.list(api, [['grant_mode', 'equals', 'direct'], ['grantee', '=', role.roleid]]))).data;
                let rolePermissionsKC = (await io_utils.noThrow(io_permission.Permissions.list(apiKC, [['grant_mode', 'equals', 'direct'], ['grantee', '=', role.roleid]]))).data;
                let compareFunc = (s: any, t: any) => {
                    return s.permissiontype === t.permissiontype && s.grantee === t.grantee && s.key_name == t.key_name;
                };
                //NEW GRANTS
                let newitems = arrayDiff(true, rolePermissionsKJ, rolePermissionsKC, compareFunc);
                let x = newitems.map((item: any) => {
                    return io_permission.Permissions.factory(item);
                });
                for (let permission of x) {
                    console.log("GRANTING PERMISSION %o", permission);
                    let result = await io_utils.noThrow(permission.grant(apiKC));
                    console.log("GRANTED PERMISSION %o", result);
                }
                //REVOKED GRANTS
                let delitems = arrayDiff(true, rolePermissionsKC, rolePermissionsKJ, compareFunc);
                let y = delitems.map((item: any) => {
                    return io_permission.Permissions.factory(item);
                });
                for (let permission of y) {
                    console.log("REVOKING PERMISSION %o", permission);
                    let result = await io_utils.noThrow(permission.revoke(apiKC));
                    console.log("REVOKED PERMISSION %o", result);
                }

            } catch (e) {
                console.log(e);
            }
        }
    } finally {
        console.log("ROLES PERMISSIONS DONE");
    }

    //Directory Users
    */

    try {

        let payload = { skip: 0, take: 1000 };
        let usersKJ = await io_utils.noThrow(api.callAPI("PUT", "/v1/search/directory_users", payload));
        let usersKC = await io_utils.noThrow(apiKC.callAPI("PUT", "/v1/search/directory_users", payload));

        let compareFunc = (s: any, t: any) => {
            return s.username === t.username && s.provider == t.provider;
        };
        let newItems = arrayDiff(true, usersKJ, usersKC, compareFunc);

        for (let r of newItems) {
            let n = new io_user.DirectoryUser(r.provider, r.username);
            console.log("CREATING DIRECTORY USER  : %o", n);
            let res = await io_utils.noThrow(n.create(apiKC));
            console.log("CREATED DIRECTORY USER : %o", res);
        }

        //DELETED 
        let deletedItems = arrayDiff(true, usersKC, usersKJ, compareFunc);
        for (let r of deletedItems) {
            let n = new io_user.DirectoryUser(r.provider, r.username);
            console.log("DELETING DIRECTORY USER : %o", n);
            let res = await io_utils.noThrow(n.delete(apiKC));
            console.log("DELETED DIRECTORY USER : %o", res);
        }
    } finally {
        console.log("ROLES PERMISSIONS DONE");
    }




}

extractQueries()
    .catch(e => console.error("ERROR: ", e.response.data))
    .finally(() => process.exit(0));
