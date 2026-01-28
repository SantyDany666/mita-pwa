import { RemindersLayout } from "../components/RemindersLayout";
import { ReminderCard } from "../components/ReminderCard";

export function RemindersPage() {
  return (
    <RemindersLayout>
      <div className="px-4 py-4 flex flex-col gap-4 pb-24 relative min-h-full">
        {/* Active Section */}
        <div>
          <h3 className="text-[#054A91] dark:text-[#81A4CD] text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
            Activos
          </h3>
          <div className="flex flex-col gap-3">
            <ReminderCard
              id="1"
              medicineName="Amoxicilina"
              dose="500"
              unit="mg"
              frequency="Cada 8 horas"
              status="active"
              nextDose="Hoy 2:00 PM"
            />
            <ReminderCard
              id="2"
              medicineName="Vitamina D3"
              dose="1000"
              unit="UI"
              frequency="Cada 24 horas"
              status="active"
              nextDose="Mañana 9:00 AM"
            />
          </div>
        </div>

        {/* Paused Section */}
        <div>
          <h3 className="text-[#3E7CB1] dark:text-[#81A4CD] text-lg font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
            Pausados
          </h3>
          <div className="flex flex-col gap-3">
            <ReminderCard
              id="3"
              medicineName="Ibuprofeno"
              dose="400"
              unit="mg"
              frequency="Cada 12 horas"
              status="paused"
            />
          </div>
        </div>

        {/* Finished Section */}
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-lg font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
            Finalizados
          </h3>
          <div className="flex flex-col gap-3">
            <ReminderCard
              id="4"
              medicineName="Azitromicina"
              dose="500"
              unit="mg"
              frequency="Cada 24 horas"
              status="finished"
              endDate="20 Oct 2023"
            />
            <ReminderCard
              id="5"
              medicineName="Loratadina"
              dose="10"
              unit="mg"
              frequency="Cada 24 horas"
              status="finished"
              endDate="15 Sep 2023"
            />
          </div>
        </div>
      </div>
    </RemindersLayout>
  );
}
