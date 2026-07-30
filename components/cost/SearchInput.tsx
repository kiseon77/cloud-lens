import React from "react";
import { Input } from "../ui/input";
//리소스명/ID 검색, debounce(300ms) 적용
export default function SearchInput() {
  return <Input type="text" placeholder="🔍 리소스명 / ID 검색" />;
}
