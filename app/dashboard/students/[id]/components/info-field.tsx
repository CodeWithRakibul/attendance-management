interface InfoFieldProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}

export function InfoField({ label, value, icon }: InfoFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </label>
      <p className="font-medium">{value || 'N/A'}</p>
    </div>
  );
}