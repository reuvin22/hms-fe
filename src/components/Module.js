import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// components
import { useSelector } from 'react-redux';
import { useComponentContext } from '@/utils/context';
import NavLink from './Navlink';

function Module({ module }) {
  const context = useComponentContext();
  const router = useRouter();
  const globalRef = useRef(null);
  const [menus, setMenus] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (module && module.module) {
      const uniquePermissions = new Set();
      const filteredMenus = module.module.filter((item) => {
        if (
          item.menu_group === context?.data.menuGroup &&
          !uniquePermissions.has(item.permission_id)
        ) {
          uniquePermissions.add(item.permission_id);
          return true;
        }
        return false;
      });
      // console.log(filteredMenus)
      setMenus(filteredMenus);
    }
  }, [module, context?.data.menuGroup]);

  const toggleAccordion = (module) => {
    if (module === 'settings') {
      setIsExpanded((prevIsExpanded) => !prevIsExpanded);
    }
  };

  const handleOnClick = () => {
    context?.onClick();
  };

  console.log(module);

  return (
    <>
      {menus.map((item, index) => {
        console.log(item);
        const isPatientRoute =
          router.asPath === `/patients/${item.module?.module_id}`;
        const isPatientSpecificRouteActive = router.asPath.startsWith(
          `/patients/${item.module?.module_id}/`
        );
        const isPatientActive = isPatientRoute || isPatientSpecificRouteActive;

        const isSettingRoute =
          router.asPath === `/settings/${item.module?.module_id}`;
        const isSettingSpecificRouteActive = router.asPath.startsWith(
          `/settings/${item.module?.module_id}/`
        );
        const isSettingActive = isSettingRoute || isSettingSpecificRouteActive;

        const isInventoryRoute =
          router.asPath === `/inventory/${item.module?.module_id}`;
        const isInventorySpecificRouteActive = router.asPath.startsWith(
          `/inventory/${item.module?.module_id}/`
        );
        const isInventoryActive =
          isInventoryRoute || isInventorySpecificRouteActive;

        const baseClasses =
          'flex items-center py-[4px] my-1 px-2 cursor-pointer rounded-lg text-sm';
        const activeClasses = 'bg-[#5e6064] text-[#fff]';
        const inactiveClasses =
          'hover:bg-[#485159] hover:text-[#fff] text-[#c2c7d0]';
        const subModuleClasses = item.module?.type === 'sub' ? 'pl-6' : '';

        return (
          // console.log(item)
          <nav className="bg-[#343a40]" key={index}>
            <ul className="mx-1 my-1">
              {item.module?.type === 'sub' ? (
                <>
                  {context?.data.menuGroup === 'patients' && (
                    <NavLink
                      shallow
                      key={index}
                      href={`/patients/${item.module?.module_id}`}
                    >
                      <div
                        onClick={() => handleOnClick()}
                        className={`${baseClasses} ${isPatientActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}
                      >
                        <svg
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: item.module?.icon
                          }}
                          style={{
                            width: '2em',
                            height: '2em',
                            marginTop: '',
                            marginRight: '5px'
                          }}
                        />
                        {item.module?.name}
                      </div>
                    </NavLink>
                  )}

                  {context?.data.menuGroup === 'human-resource' && (
                    <NavLink
                      shallow
                      key={index}
                      href={`/human-resource/${item.module?.module_id}`}
                    >
                      <div
                        onClick={() => handleOnClick()}
                        className={`${baseClasses} ${isSettingActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}
                      >
                        <svg
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: item.module?.icon
                          }}
                          style={{
                            width: '2em',
                            height: '2em',
                            marginTop: '',
                            marginRight: '5px'
                          }}
                        />
                        {item.module?.name}
                      </div>
                    </NavLink>
                  )}

                  {context?.data.menuGroup === 'materials' && (
                    <NavLink
                      shallow
                      key={index}
                      href={`/materials/${item.module?.module_id}`}
                    >
                      <div
                        onClick={() => handleOnClick()}
                        className={`${baseClasses} ${isSettingActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}
                      >
                        <svg
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: item.module?.icon
                          }}
                          style={{
                            width: '2em',
                            height: '2em',
                            marginTop: '',
                            marginRight: '5px'
                          }}
                        />
                        {item.module?.name}
                      </div>
                    </NavLink>
                  )}

                  {context?.data.menuGroup === 'settings' && (
                    <NavLink
                      shallow
                      key={index}
                      href={`/settings/${item.module?.module_id}`}
                    >
                      <div
                        onClick={() => handleOnClick()}
                        className={`${baseClasses} ${isInventoryActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}
                      >
                        <svg
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: item.module?.icon
                          }}
                          style={{
                            width: '2em',
                            height: '2em',
                            marginTop: '',
                            marginRight: '5px'
                          }}
                        />
                        {item.module?.name}
                      </div>
                    </NavLink>
                  )}
                </>
              ) : (
                <NavLink
                  shallow
                  key={index}
                  href={`/${item.module?.module_id}`}
                >
                  {/* ${router.pathname === `/${item.module?.module_id}`  */}
                  <div
                    className={`${
                      router.pathname.startsWith(`/${item.module?.module_id}`)
                        ? 'bg-[#5e6064] cursor-pointer text-[#fff] rounded-lg text-sm '
                        : 'hover:bg-[#485159] hover:text-[#fff] cursor-pointer text-[#c2c7d0] rounded-lg text-sm'
                    }
                                                        ${item.module?.type === 'sub' ? 'pl-9' : ''} flex items-center py-[5px] my-1 px-2`}
                  >
                    <svg
                      className=""
                      dangerouslySetInnerHTML={{ __html: item.module?.icon }}
                      style={{
                        width: '2em',
                        height: '2em',
                        marginTop: '',
                        marginRight: '5px'
                      }}
                    />

                    {item.module?.name}
                  </div>
                </NavLink>
              )}
            </ul>
          </nav>
        );
      })}
    </>
  );
}

export default React.memo(Module);
