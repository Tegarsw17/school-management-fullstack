import Announcements from '@/components/Announcements';
import BigCalender from '@/components/BigCalender';
import BigCalenderContainer from '@/components/BigCalenderContainer';
import FormContainer from '@/components/FormContainer';
import PerformanceChart from '@/components/PerformaceChart';
import StudentAttandanceCard from '@/components/StudentAttandanceCard';
import { getUserRole } from '@/lib/authUtils';
import { prisma } from '@/lib/prisma';
import { Class, Student } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { role } = await getUserRole();
  const student:
    | (Student & {
        class: (Class & { _count: { lessons: number } }) | null;
      })
    | null = await prisma.student.findUnique({
    where: { id },
    include: {
      class: { include: { _count: { select: { lessons: true } } } },
    },
  });

  if (!student) {
    return notFound();
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/* top */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* user info card */}
          <div className="bg-starSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.img || '/noAvatar.png'}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.name + ' ' + student.surname}
                </h1>
                {role === 'admin' && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={'/blood.png'} alt="logo" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={'/date.png'} alt="logo" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat('id-ID').format(
                      new Date(student.birthday)
                    )}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={'/mail.png'} alt="logo" width={14} height={14} />
                  <span>{student.email || '-'}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={'/phone.png'} alt="logo" width={14} height={14} />
                  <span>{student.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          {/* small card */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* card */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={'/singleAttendance.png'}
                alt="logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense>
                <StudentAttandanceCard id={student.id} />
              </Suspense>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={'/singleBranch.png'}
                alt="logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class?.name.charAt(0)}
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={'/singleLesson.png'}
                alt="logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class?._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lesson</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={'/singleClass.png'}
                alt="logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class?.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalenderContainer type="classId" id={student.class?.id ?? 0} />
        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-starSkyLight"
              href={`/list/lessons?classId=${2}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-starPurpleLight"
              href={`/list/teachers?classId=${2}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-red-50"
              href={`/list/assignments?classId=${2}`}
            >
              Student&apos;s Assigments
            </Link>
            <Link
              className="p-3 rounded-md bg-starYellowLight"
              href={`/list/exams?classId=${2}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-green-50"
              href={`/list/results?studentId=${'student2'}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <PerformanceChart />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
