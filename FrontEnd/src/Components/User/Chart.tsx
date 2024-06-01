import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function AgePieChart({ users }: { users: any[] }) {
    const [ageData, setAgeData] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (users.length > 0) {
            const ageCounts = users.reduce((acc: any, user: any) => {
                const ageGroup = Math.floor(user.age / 10) * 10; // Group ages by 10s
                acc[ageGroup] = (acc[ageGroup] || 0) + 1;
                return acc;
            }, {});

            const data = Object.keys(ageCounts).map((ageGroup) => ({
                id: ageGroup,
                value: ageCounts[ageGroup],
                label: `     ${ageGroup}-${parseInt(ageGroup, 10) + 9}`, // Label with age range
            }));

            setAgeData(data);
        }
    }, [users]);

    return (
        <PieChart
            series={[
                {
                    data: ageData,
                },
            ]}
            width={400}
            height={200}
        />
    );
}
