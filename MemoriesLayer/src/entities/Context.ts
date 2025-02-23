import { Column, Entity, Index } from "typeorm";

@Index("Context_pkey", ["id"], { unique: true })
@Entity("Context", { schema: "public" })
export class Context {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("time with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: string;

  @Column("character varying", { name: "context" })
  context: string;
}
