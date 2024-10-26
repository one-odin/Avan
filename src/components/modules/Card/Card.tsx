import { CardType } from "../../../data.type";

function Card({ children, description, count, title }: CardType): JSX.Element {
  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-lg">
      <div className="flex w-full grow items-center justify-between p-5 lg:p-6">
        <dl>
          <dt className="text-blue- text-2xl font-bold">
            {count && `${count.toLocaleString()} $`}
            {title && title}
          </dt>
          <dd className="text-slate-600">{description}</dd>
        </dl>
        {children}
      </div>
    </div>
  );
}

export default Card;
