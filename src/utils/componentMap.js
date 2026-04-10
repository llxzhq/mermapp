// src/utils/componentMap.js

import AssignedPermissions from "../pages/permissions/AssignedPermissions";
import Businesses from "../pages/businesses/Businesses";
import CreateAssignedPermissions from "../pages/permissions/CreateAssignedPermissions";
import CreateBusinesses from "../pages/businesses/CreateBusinesses";
import CreateModule from "../pages/modules/CreateModule";
import CreatePermission from "../pages/permissions/CreatePermission";
import CreatePerson from "../pages/persons/CreatePerson";
import CreateProductCategories from "../pages/product_categories/CreateProductCategories";
import CreateProducts from "../pages/products/CreateProducts";
import CreateRol from "../pages/roles/CreateRol";
import CreateSection from "../pages/sections/CreateSection";
import CreateSectionModules from "../pages/sections/CreateSectionModules";
import CreateUser from "../pages/users/CreateUser";
import EditAssignedPermissions from "../pages/permissions/EditAssignedPermissions";
import EditBusinesses from "../pages/businesses/EditBusinesses";
import EditModule from "../pages/modules/EditModule";
import EditPermission from "../pages/permissions/EditPermission";
import EditPerson from "../pages/persons/EditPerson";
import EditProductCategories from "../pages/product_categories/EditProductCategories";
import EditProducts from "../pages/products/EditProducts";
import EditRol from "../pages/roles/EditRol";
import EditSection from "../pages/sections/EditSection";
import EditSectionModules from "../pages/sections/EditSectionModules";
import EditUser from "../pages/users/EditUser";
import Inventory from "../pages/inventory/Inventory";
import Modules from "../pages/modules/Modules";
import Permissions from "../pages/permissions/Permissions";
import Persons from "../pages/persons/Persons";
import ProductCategories from "../pages/product_categories/ProductCategories";
import Products from "../pages/products/Products";
import Roles from "../pages/roles/Roles";
import Sales from "../pages/sales/Sales";
import SectionModules from "../pages/sections/SectionModules";
import Sections from "../pages/sections/Sections";
import Users from "../pages/users/Users";

export const componentMap = {
  Businesses,
  CreateBusinesses,
  EditBusinesses,
  Persons,
  CreatePerson,
  EditPerson,
  Roles,
  CreateRol,
  EditRol,
  Users,
  CreateUser,
  EditUser,
  Modules,
  CreateModule,
  EditModule,
  Permissions,
  CreatePermission,
  EditPermission,
  Sections,
  CreateSection,
  EditSection,
  AssignedPermissions,
  CreateAssignedPermissions,
  EditAssignedPermissions,
  SectionModules,
  CreateSectionModules,
  EditSectionModules,
  ProductCategories,
  CreateProductCategories,
  EditProductCategories,
  Products,
  CreateProducts,
  EditProducts,
  Inventory,
  Sales,
};
