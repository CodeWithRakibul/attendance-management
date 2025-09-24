import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderTabProps {
  title: string;
  message: string;
}

export function PlaceholderTab({ title, message }: PlaceholderTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}