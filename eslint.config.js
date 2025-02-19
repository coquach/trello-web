import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      //React
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": 0,
      "react/display-name": 0,
      //MUI
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@mui/*/*/*"],
        },
      ],
      //Common
      curly: ["error", "all"], // Bắt buộc có dấu `{}` khi dùng if, else, for...
      "arrow-body-style": ["error", "as-needed"], // Không cần `{}` nếu function chỉ có return
      "prefer-const": "error", // Luôn dùng `const` nếu không reassigned
      "no-var": "error", // Không cho phép dùng var
      "object-shorthand": "error", // Bắt buộc dùng shorthand trong object
      "prefer-template": "error", // Khuyến khích dùng template string thay vì +
      "no-duplicate-imports": "error", // Không import trùng
      "no-useless-rename": "error", // Không đổi tên import vô nghĩa
      "no-return-await": "error", // Tránh return await không cần thiết
      "require-await": "error", // Hàm async phải có `await`
      "no-unused-vars": "warn",
      "no-trailing-spaces": 1,
      "no-multi-spaces": 1,
      "no-multiple-empty-lines": 1,
    },
  },
];
