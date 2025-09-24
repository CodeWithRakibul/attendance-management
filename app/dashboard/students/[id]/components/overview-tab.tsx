import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IconUser, IconPhone, IconMapPin } from '@tabler/icons-react';
import { InfoField } from './info-field';

interface OverviewTabProps {
  personal: any;
  guardian: any;
  address: any;
}

export function OverviewTab({ personal, guardian, address }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Father's Name" value={guardian?.fatherName} />
            <InfoField label="Mother's Name" value={guardian?.motherName} />
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <InfoField 
              label="Date of Birth" 
              value={personal?.dob ? new Date(personal.dob).toLocaleDateString() : null} 
            />
            <InfoField label="Gender" value={personal?.gender} />
            <InfoField label="Blood Group" value={personal?.bloodGroup} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPhone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoField 
              label="Phone" 
              value={guardian?.contact?.smsNo} 
              icon={<IconPhone className="h-3 w-3" />} 
            />
            <InfoField 
              label="Email" 
              value={guardian?.contact?.email} 
              icon={<IconPhone className="h-3 w-3" />} 
            />
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <IconMapPin className="h-3 w-3" />
              Address
            </label>
            <p className="font-medium leading-relaxed">{address?.present || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}