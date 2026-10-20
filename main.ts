import getStatus, { computeAverage } from "./gradeUtils";
import { Enrollee, EligibilityReport, EnrollmentStatus } from "./types";

const enrollees: Enrollee[] = [
    { name: "Ana Cruz", prelim: 85, midterm: 90, final: 88 },
    { name: "Bea Santos", prelim: 70, midterm: 65, final: 60 },
    { name: "Cid Ramos", prelim: 95, midterm: 92, final: 97 },
    { name: "Dex Alonzo", prelim: 60, midterm: 55, final: 50 },
    { name: "Eli Tan", prelim: 78, midterm: 80, final: 76 },
];

const getEnrollees = (shouldFail: boolean = false): Promise<Enrollee[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error ("Could not connect to the registrar API."));
            } else {
                resolve(enrollees);
            }
        }, 1000);
    });
};

const fetchBatchId = (): string | number =>
    Math.random() > 0.5 ? "b-2026-01" : 2026001;
const formatBatchId = (id: string | number): string => {
    if (typeof id === "string") {
        return id.toUpperCase();
    }
    return 'BATCH-${id.toString().padStart(7, "0")}';
};

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
    return items.reduce((acc: Record<string, T[]>, item: T) => {
        const key = keyFn(item);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}

const buildReport = async (): Promise<void> => {
    try {
        const batchId: string | number = fetchBatchId();
        console.log('Batch ID: ${formatBatchId(batchId)}');

        const data: Enrollee[] = await getEnrollees();

        const results: EligibilityReport[] = data.map(
            ({ name, prelim, midterm, final }: Enrollee): EligibilityReport => {
                const average = computeAverage(prelim, midterm, final);
                const status = getStatus(average);
                const report: EligibilityReport = { name, average, status };
                if (status === EnrollmentStatus.Probation) {
                    report.remarks = "Needs consultation";
                }
                return report;
            }
        );

        const grouped = groupBy(results, (r) => r.status);
        const passingList = grouped[EnrollmentStatus.Passing] ?? [];

        const classAverage: number = 
            results.reduce((sum: number, { average }: EligibilityReport) => sum + average, 0) /
            results.length;

        console.log("=== IT313 Enrollment Eligibility Report (TypeScript) ===");
        results.forEach(({ name, average, status, remarks }) => {
            const note = remarks ? ` - ${remarks}` : "";
            console.log(`${name} - Average: ${average.toFixed(2)} - ${status}${note}`);
        });
        console.log(`\nClass Average: ${classAverage.toFixed(2)}`);
        console.log(`Passing: ${passingList.length} / ${results.length}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Registrar connection failed: ${message}`);
    }
};

buildReport();