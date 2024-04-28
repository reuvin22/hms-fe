import { debounce, identity } from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useGrantUserModuleMutation } from '@/service/authService';

const UserProfile = React.memo(
  ({ data, type, module, permission, onRefetch }) => {
    const [modules, setModules] = useState(module);
    const [permissions, setPermissions] = useState(permission);
    const [moduleLoading, setModuleLoading] = useState(true);

    const [grantUserModule, { isLoading: grantModuleLoading }] =
      useGrantUserModuleMutation();

    useEffect(() => {
      setModules(module);
      // setPermissions(permission);
    }, [module]);

    // const handleOnchange = useCallback(
    //   (moduleId) => {
    //     setPermissions((prevPermission) => {
    //       const updatedPermission = {
    //         ...prevPermission,
    //         [moduleId]: !prevPermission[moduleId]
    //       };
    //       handleAutoSave(modules?.module, updatedPermission);
    //       return updatedPermission;
    //     });
    //   },
    //   [permissions]
    // );

    const toggleData = [];
    const handleOnChange = (data) => {
      setPermissions((prevPermission) => ({
        ...prevPermission,
        [data.moduleId]: !prevPermission[data.moduleId]
      }));

      // grantUserModule({ toggleData, identity_id: data?.user_id })
      //   .unwrap()
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    };

    console.log(permission);

    const prepareLogData = async (currentModules, currentPermission) => {
      const menuGrouMapping = {
        dashboard: [
          'patients',
          'emergency-room',
          'laboratory',
          'pharmacy',
          'finance',
          'ambulance',
          'certificate-record',
          'human-resource',
          'inventory',
          'settings'
        ],
        patients: ['in-patient', 'out-patient', 'telumed'],
        materials: [
          'supplier',
          'purchage-order',
          'delivery',
          'donations',
          'stock-request'
        ],
        settings: [
          'system',
          'hr',
          'charges',
          'bed',
          'symptoms',
          'pharmacy-config',
          'panthology',
          'radiology',
          'doh-report'
        ]
      };

      const toggledModules = currentModules?.filter(
        (m) => currentPermission[m.module_id]
      );
      const toggleMenuGroups = new Set(
        toggledModules.filter((m) => m.menu_group).map((m) => m.module_id)
      );
      const toggleData = [];
      toggledModules.forEach((module) => {
        if (module.menu_group) {
          toggleData.push({
            permission_id: module.module_id,
            identity_id: data?.user_id,
            menu_group: module.module_id
          });

          toggledModules
            .filter((m) => m.menu_group)
            .forEach((mod) => {
              if (module.module_id !== mod.module_id) {
                toggleData.push({
                  permission_id: module.module_id,
                  identity_id: data?.user_id,
                  menu_group: mod.module_id
                });
              }
            });
        } else {
          let assignedMenuGroup = null;
          Object.entries(menuGrouMapping).forEach(
            ([menuGroupId, moduleIds]) => {
              if (moduleIds.includes(module.module_id)) {
                assignedMenuGroup = menuGroupId;
              }
            }
          );
          toggleData.push({
            permission_id: module.module_id,
            identity_id: data?.user_id,
            menu_group: assignedMenuGroup
          });
        }
      });

      console.log(toggleData);

      await grantUserModule({ toggleData, identity_id: data?.user_id })
        .unwrap()
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // const handleAutoSave = debounce(prepareLogData);

    return (
      <div>
        <div className="mx-auto space-y-4">
          <div className="bg-white border border-gray-300 shadow-gray-200 rounded-md p-6 mt-4">
            <div className="flex items-center space-x-4">
              <img
                src=""
                alt="Profile picture"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold">
                  {data?.identity?.last_name !== null
                    ? data?.identity?.last_name
                    : 'No Last Name'}{' '}
                  {data?.identity?.first_name !== null
                    ? data?.identity?.first_name
                    : 'No First Name'}
                </h1>
                <p>{data?.email}</p>
              </div>
            </div>

            <div className="flex space-x-4" />
          </div>

          <div className="flex space-x-4">
            {type === 'view' && (
              <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                <h2 className="font-bold text-sm uppercase text-gray-600 px-4 py-2">
                  Personal Information
                </h2>
                <div className="p-4">
                  <h1>hellow world</h1>
                </div>
              </div>
            )}

            {type === 'edit' && (
              <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                <div className="flex justify-between">
                  <div className="px-4 py-2 mt-1">
                    <h2 className="font-bold text-sm uppercase text-gray-600">
                      Modules
                    </h2>
                  </div>
                  {grantModuleLoading ? (
                    <div className="px-4 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-6 animate-spin text-gray-700"
                        viewBox="0 0 100 100"
                        fill="none"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="32"
                          stroke-width="8"
                          stroke="currentColor"
                          stroke-dasharray="50.26548245743669 50.26548245743669"
                          fill="none"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="p-4 space-y-2">
                  {modules?.module?.map((mod, index) => (
                    <div className="flex">
                      <label
                        key={index}
                        className="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={permissions[mod.module_id]}
                          onChange={() =>
                            handleOnChange({ moduleId: mod.module_id })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                        <span className="ms-3 text-sm font-medium text-gray-700">
                          {mod.type === 'sub' ? `--- ${mod.name}` : mod.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
              <div className="px-4 py-2 mt-1">
                <h2 className="font-bold text-sm uppercase text-gray-600">
                  Activities
                </h2>
              </div>
              <div className="p-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default UserProfile;
