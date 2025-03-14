export default function DayColorIndicator() {
  return (
    <div className='flex gap-1'>
      <div className='py-[2px] px-3 bg-red-200 text-red-900 rounded-full'>
        <p className='text-sm font-medium'>Sunday</p>
      </div>
      <div className='py-[2px] px-3 bg-blue-200 text-blue-900 rounded-full'>
        <p className='text-sm font-medium'>Holiday</p>
      </div>
      <div className='py-[2px] px-3 bg-purple-200 text-purple-900 rounded-full'>
        <p className='text-sm font-medium'>Sunday & Holiday</p>
      </div>
    </div>
  );
}
