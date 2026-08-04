import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export default function AlertRuleForm() {
  return (
    <Card>
      <CardHeader>새 예산 등록</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button variant="outline">팀 / 프로젝트 선택</Button>
        <Button variant="outline">월 예산 ($)</Button>
      </CardContent>
      <CardFooter>
        <Button>저장</Button>
      </CardFooter>
    </Card>
  );
}
