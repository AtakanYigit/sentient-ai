import { Column, Entity, Index } from "typeorm";

@Index("Vitals_pkey", ["id"], { unique: true })
@Entity("vitals", { schema: "public" })
export class Vitals {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name", length: 56 })
  name: string;

  @Column("integer", { name: "level", default: () => "0" })
  level: number;
}
