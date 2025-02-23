import { Column, Entity, Index } from "typeorm";

@Index("short_erm_memories_pkey", ["id"], { unique: true })
@Entity("short_term_memories", { schema: "public" })
export class ShortTermMemories {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "action" })
  action: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "last_accessed",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastAccessed: Date;

  @Column("integer", { name: "totall_accesses", default: () => "0" })
  totallAccesses: number;
}
