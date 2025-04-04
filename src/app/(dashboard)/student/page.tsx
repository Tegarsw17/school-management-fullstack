import Announcements from '@/components/Announcements';
import BigCalender from '@/components/BigCalender';
import BigCalenderContainer from '@/components/BigCalenderContainer';
import EventCalender from '@/components/EventCalender';
import { getUserRole } from '@/lib/authUtils';
import { prisma } from '@/lib/prisma';

const StudentPage = async () => {
  const { currentUserId } = await getUserRole();

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: currentUserId! } },
    },
  });

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* left */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4a)</h1>
          <BigCalenderContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
