import Announcements from '@/components/Announcements';
import BigCalender from '@/components/BigCalender';
import BigCalenderContainer from '@/components/BigCalenderContainer';
import { getUserRole } from '@/lib/authUtils';
import { prisma } from '@/lib/prisma';

const ParentPage = async () => {
  const { currentUserId } = await getUserRole();

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* left */}
      <div className="flex flex-col w-full xl:w-2/3 gap-4">
        {students.map((student) => (
          <div className="w-full" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + ' ' + student.surname})
              </h1>
              <BigCalenderContainer type="classId" id={student?.classId ?? 0} />
            </div>
          </div>
        ))}
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
