Health Care Management System

## Files Directory

```
root/
├── public/
├── src/
|    ├── app/
|    ├── components/
|    ├── lib/
|    ├── pages/
|    ├── service/
|    └── store/
|          ├── actions
|          |     └── authActions.js
|          ├── reducers
|          |     └── authSlice.js
|          └── store.js
├── .env
├── .eslintrc.json
├── jsonconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js

```

## Naming Convention

### Pages
* Page names should same with `module_id` regardless if singular or plural
* `Format: kebab-case`

### Components
* We used singular for components 
* `Format: PascalCase`

### Service
* For service; used Camel Case
* `Format: camelCase`

### Store
* Store was divided into two folders actions and reducers; for actions file name should end with `Actions`
* `Format: authActions`
* For reducers it should `Slice`
* `Format: authSlice`




